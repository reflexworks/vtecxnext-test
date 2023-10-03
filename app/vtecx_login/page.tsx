// Import your Client Component
import HomePagePart from './vtecx_login'
import * as useclient from './servercomponent'

const fetchNow = async (): Promise<useclient.Props> => {
  const now = await useclient.now()
  const props: useclient.Props = {
    now: now
  }
  return props
}

const HomePage = async () => {
  const props:useclient.Props = await fetchNow()
  return <HomePagePart now={props.now} />
}

export default HomePage
