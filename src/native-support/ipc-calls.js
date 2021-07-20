import { BRG_MSG_SET_PORT } from './message-constant'
import { setHttpPort, setSocksPort } from './configs-manager'

export const IPCCalls = {
    [BRG_MSG_SET_PORT]: (args) => {
        const { httpPort, socksPort } = args
        if (httpPort) {
            setHttpPort(httpPort)
        }
        if (socksPort) {
            setSocksPort(socksPort)
        }
        return Promise.resolve()
    }
}
