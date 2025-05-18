const state = () => ({
  accessToken: '',
  refreshToken: '',
  profile: {} // 用户信息
});

const mutations = {
  SET_REFRESHTOKEN(state, token) {
    state.refreshToken = token;
  },
  SET_ACCESSTOKEN(state, token) {
    state.accessToken = token;
  },
  SET_PROFILE(state, user) {
    state.profile = user;
  },
  LOGOUT(state) {
    state.accessToken = '';
    state.profile = {};
  }
};

const actions = {
  logout({ commit }) {
    commit('LOGOUT');
  }
};

const getters = {
  isLogin: state => !!state.accessToken,
  userName: state => state.profile?.username || ''
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
