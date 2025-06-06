import api from "@/api"
export async function restoreAuth(store) {
    const accessToken = localStorage.getItem('accessToken')
    const user = localStorage.getItem('user')
    if (!accessToken || !user) return

    try {
        const userProfile = JSON.parse(user)
        const res1 = await api.validateAccessToken()
        if (res1.code == 0) {
            login(store, accessToken, userProfile)
        } else {
            const res2 = await api.validateRefreshToken({
                refresh_token: localStorage.getItem('refresh_token')
            })
            if (res2.code == 0) {
                login(store, accessToken, userProfile)
            } else {
                logout(store)
            }
        }
    } catch (err) {
        // 清除状态
        logout(store)
    }
}

function login(store, accessToken, userProfile) {
    store.commit('user/SET_ACCESSTOKEN', accessToken)
    store.commit('user/SET_PROFILE', userProfile)
}

function logout(store) {
    store.commit('user/LOGOUT')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
}