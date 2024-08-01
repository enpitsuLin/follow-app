import { formatDistance } from 'date-fns'
import { eq } from 'drizzle-orm'
import { Image } from 'expo-image'
import { Link } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { FlatList, Pressable, View } from 'react-native'
import { useStyles } from 'react-native-unistyles'

import { apiClient } from '~/api/client'
import { fetchAndUpdateEntriesInDB } from '~/api/entry'
import { Column, Container, Row, Text } from '~/components'
import { SiteIcon } from '~/components/site-icon'
import { db } from '~/db'
import type { Entry, Feed } from '~/db/schema'
import { entries } from '~/db/schema'
import { useEntryList } from '~/hooks/use-entry-list'

type EntryItemProps = {
  entry: Entry & { feed: Feed }
  options?: {
    hideImage?: boolean
    hideDescription?: boolean
    hideSiteIcon?: boolean
  }
}

function SiteImage({ feed, size = 24 }: { feed: Feed, size?: number }) {
  return feed?.image
    ? (
        <Image
          source={{ uri: feed.image }}
          style={{ width: size, height: size, borderRadius: size / 4 }}
        />
      )
    : (
        <SiteIcon source={feed?.siteUrl} />
      )
}

function EntryItem({ entry, options }: EntryItemProps) {
  const { theme } = useStyles()
  const data = entry.feed
  return (
    <>
      <Link href={`/feed/detail/${entry.id}`} asChild>
        <Pressable>
          <Row px={15} py={12} gap={10}>
            {!options?.hideSiteIcon && <SiteImage feed={data} />}
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 8 / 2,
                backgroundColor: entry?.read ? 'transparent' : theme.colors.accent10,
                position: 'absolute',
                left: 5,
                top: 9,
              }}
            />
            <Column gap={6} flex={1}>
              <Row gap={6}>
                <Text size={10}>{data?.title}</Text>
                <Text size={10}>
                  {formatDistance(
                    new Date(entry.publishedAt),
                    new Date(),
                    { addSuffix: true },
                  )}
                </Text>
              </Row>
              <Row>
                <Text style={{ flex: 1, flexWrap: 'wrap' }} weight={600} numberOfLines={2}>
                  {entry.title}
                </Text>
              </Row>
              {!options?.hideDescription && (
                <Text size={12} numberOfLines={3}>
                  {entry.description}
                </Text>
              )}
            </Column>
            {options?.hideImage
              ? null
              : options?.hideSiteIcon
                ? <SiteImage feed={data} size={60} />
                : (entry.media && entry.media.find(media => media.type === 'photo'))
                    ? (
                        <Image
                          source={{
                            uri: entry.media.find(media => media.type === 'photo')?.url,
                          }}
                          style={{ width: 50, height: 50, borderRadius: 5 }}
                        />
                      )
                    : null}
          </Row>
        </Pressable>
      </Link>
      <Row w="100%" h={1} bg="component" />
    </>
  )
}

export function EntryList({
  feedIdList,
  options,
}: {
  feedIdList: string[]
  options?: EntryItemProps['options']
}) {
  const checkedEntryIdList = useRef(new Set<string>())
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { data: entryList } = useEntryList(feedIdList)

  useEffect(() => {
    if (entryList && entryList.length === 0) {
      fetchAndUpdateEntriesInDB({
        feedIdList,
      }).catch(console.error)
    }
  }, [entryList])

  return (
    <>
      <Container>
        <FlatList
          contentInsetAdjustmentBehavior="automatic"
          data={entryList}
          renderItem={({ item }) => <EntryItem entry={item} options={options} />}
          refreshing={isRefreshing}
          onRefresh={async () => {
            setIsRefreshing(true)
            checkedEntryIdList.current.clear()
            fetchAndUpdateEntriesInDB({
              feedIdList,
              publishedBefore: entryList?.at(0)?.publishedAt,
            })
              .catch(console.error)
              .finally(() => setIsRefreshing(false))
          }}
          onEndReached={() => {
            fetchAndUpdateEntriesInDB({
              feedIdList,
              publishedAfter: entryList?.at(-1)?.publishedAt,
            }).catch(console.error)
          }}
          onViewableItemsChanged={async ({ viewableItems }) => {
            await Promise.all(
              viewableItems
                .filter(({ item }) => !checkedEntryIdList.current.has(item.id))
                .map(async ({ item }) => {
                  const res = await apiClient.entries.$get({
                    query: { id: item.id },
                  })
                  checkedEntryIdList.current.add(item.id)
                  if (res.data?.read !== item.read) {
                    await db
                      .update(entries)
                      .set({ read: res.data?.read ?? false })
                      .where(eq(entries.id, item.id))
                  }
                }),
            )
          }}
        />
      </Container>
    </>
  )
}
