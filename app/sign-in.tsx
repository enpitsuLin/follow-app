import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Button, Column, Container, Text } from '~/components'

function obtainAuthToken() {
  return new Promise<string>((resolve) => {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const { hostname, queryParams } = Linking.parse(url)
      if (hostname === 'auth' && queryParams !== null && typeof queryParams.token === 'string') {
        WebBrowser.dismissBrowser()
        const { token } = queryParams
        resolve(token)
        subscription.remove()
      }
    })
    void WebBrowser.openBrowserAsync(process.env.EXPO_PUBLIC_FOLLOW_LOGIN_URL)
  })
}

export default function SignIn() {
  return (
    <Container>
      <SafeAreaView>
        <Column px={16}>
          <Button
            fullWidth
            onPress={async () => {
              await obtainAuthToken()
            }}
          >
            <Text>Login</Text>
          </Button>
        </Column>
      </SafeAreaView>
    </Container>
  )
}
