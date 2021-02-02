import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { UserModule } from './User';
import { ReportModule } from './Report';

export default createStore({
  state: {},
  mutations: {},
  actions: {
  },
  modules: {
    User: UserModule,
    Report: ReportModule,
  },
  plugins: [createPersistedState()],
});
