import { formatDate } from 'date-fns'
import { Video } from 'expo-av'
import { Image } from 'expo-image'
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView } from 'react-native'
import PagerView from 'react-native-pager-view'
import { useStyles } from 'react-native-unistyles'
import useSWR from 'swr'

import { apiClient } from '~/api/client'
import { flagEntryReadStatus, loadEntryContent } from '~/api/entry'
import { Column, Container, Iconify, Row, Text } from '~/components'
import { FeedContent } from '~/components/feed-content'
import { blurhash } from '~/consts/blur'
import type { Entry } from '~/db/schema'
import { useEntryList } from '~/hooks/use-entry-list'
import { useTabInfo } from '~/hooks/use-tab-info'
import { openExternalUrl } from '~/lib/utils'

function LazyComponent({
  componentKey,
  currentKey,
  children,
  placeholder,
}: {
  componentKey: string
  currentKey: string
  children: React.ReactNode
  placeholder?: React.ReactNode
}) {
  const [hasRendered, setHasRendered] = useState(false)

  useEffect(() => {
    if (!hasRendered && currentKey === componentKey)
      setHasRendered(true)
  }, [currentKey, componentKey, hasRendered])

  if (hasRendered)
    return children
  return placeholder || <></>
}

export default function Page() {
  const { entryId, feedId } = useLocalSearchParams<'/(app)/feed/detail/[entryId]', { feedId: string }>()
  const feedIdList = useMemo(() => feedId.split(','), [feedId])
  const { data: entryList } = useEntryList(feedIdList)
  const { theme } = useStyles()
  const entryIndex = entryList?.findIndex(i => i.id === entryId)
  const [currentPageIndex, setCurrentPageIndex] = useState(entryIndex)
  const currentEntry = useMemo(() => currentPageIndex !== undefined ? entryList?.at(currentPageIndex) : null, [entryList, currentPageIndex])

  const entryIdListToMarkAsRead = useRef<string[]>([])
  const navigation = useNavigation()
  useEffect(
    () => navigation.addListener(
      'beforeRemove',
      () => {
        flagEntryReadStatus({ entryId: entryIdListToMarkAsRead.current })
          .catch(console.error)
      },
    ),
    [navigation],
  )

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: theme.colors.gray2,
          },
          headerTitleStyle: {
            color: theme.colors.gray12,
          },
        }}
      />
      <Container>
        <PagerView
          style={{ flex: 1 }}
          initialPage={entryIndex}
          onPageSelected={(e) => {
            const { position } = e.nativeEvent
            setCurrentPageIndex(position)
            const entry = entryList?.[position]

            if (entry && !entry.content) {
              loadEntryContent(entry.id)
                .catch(console.error)
            }

            if (entry && !entry.read) {
              entryIdListToMarkAsRead.current.push(entry.id)
            }
          }}
        >
          {entryList?.map(entry => (
            <LazyComponent
              key={entry.id}
              componentKey={entry.id}
              currentKey={currentEntry?.id ?? ''}
              placeholder={<ActivityIndicator />}
            >
              <EntryDetail entry={entry} />
            </LazyComponent>
          ))}
        </PagerView>
      </Container>
    </>
  )
}

function EntryDetail({ entry }: { entry: Entry }) {
  const { data } = useSWR(
    ['entry-detail', entry.id],
    () => apiClient.entries.$get({ query: { id: entry.id } }),
  )
  const { data: summary } = useSWR(
    ['entry-summary', entry.id],
    () => apiClient.ai.summary.$get({ query: { id: entry.id } }),
  )
  const readUserAvatars = Object.values(data?.data?.users ?? {})
    .map(i => i.image)
    .filter((i): i is string => i !== null)

  const mediaList = entry.media ?? []
  const { view } = useTabInfo()

  return (
    <ScrollView>
      <Column gap={8}>
        {(mediaList.length > 0 && view !== 5) && (
          <PagerView
            style={{
              width: '100%',
              aspectRatio: Math.max(...mediaList.map(media => (media.width && media.height) ? media.width / media.height : 1), 1),
            }}
          >
            {mediaList.map(media => (
              media.type === 'photo'
                ? (
                    <Image
                      key={media.url}
                      source={{ uri: media.url }}
                      style={{
                        width: '100%',
                        aspectRatio: (media.width && media.height) ? media.width / media.height : 1,
                      }}
                      contentFit="contain"
                      placeholder={{ blurhash }}
                    />
                  )
                : (
                    <Video
                      key={media.url}
                      source={{ uri: media.url }}
                      style={{
                        width: '100%',
                        aspectRatio: (media.width && media.height) ? media.width / media.height : 1,
                      }}
                      useNativeControls
                    />
                  )
            ))}
          </PagerView>
        )}
        <Text
          size={24}
          weight={600}
          style={{
            textDecorationLine: 'underline',
            marginBottom: 8,
            paddingHorizontal: 15,
            marginVertical: 15,
          }}
          onPress={() => {
            openExternalUrl(entry.url)
              .catch(console.error)
          }}
        >
          {entry?.title}
        </Text>
        {entry.author && (
          <Text style={{ paddingHorizontal: 15 }}>
            {entry.author}
          </Text>
        )}
        <Row gap={5} px={15} align="center">
          <Text>
            {formatDate(entry.publishedAt, 'yyyy-MM-dd HH:mm')}
          </Text>
          {(data?.data?.entryReadHistories?.readCount !== undefined) && (
            <>
              <Iconify icon="mingcute:eye-2-line" />
              <Text>
                {data?.data?.entryReadHistories?.readCount}
              </Text>
            </>
          )}
        </Row>
        {readUserAvatars.length > 0 && (
          <Row mb={30} mx={15}>
            {readUserAvatars
              .slice(0, 20)
              .map((image, index) => (
                <Image
                  key={image}
                  source={{ uri: image }}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    position: 'absolute',
                    left: 15 * index,
                  }}
                />
              ))}
          </Row>
        )}
        {summary?.data && (
          <Column
            bg="subtle"
            p={15}
            gap={15}
          >
            <Row align="center" gap={10}>
              <Iconify icon="mingcute:magic-2-fill" />
              <Text>AI summary</Text>
            </Row>
            <Text>
              {summary.data}
            </Text>
          </Column>
        )}
      </Column>
      <FeedContent html={entry?.content ?? ''} />
    </ScrollView>
  )
}
