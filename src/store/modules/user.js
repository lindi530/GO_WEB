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
  SET_PROFILE_AVATAR(state, avatar) {
    state.profile.avatar = avatar;
  },
  MODIFT_PROFILE(state, profile) {
    state.profile.username = profile.username;
    state.profile.email = profile.email;
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
  accessToken: state => state?.accessToken,
  userName: state => state.profile?.username || '',
  userEmail: state => state.profile?.email || '',
  updateTime: state => state.profile?.update_time || '',
  userAvatar: state => state.profile?.avatar || 'https://cdn.acwing.com/media/user/profile/photo/89646_sm_28e4eb758d.jpg',
  userId: state => state.profile?.user_id || '', 
  userInfo: state => state.profile
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
