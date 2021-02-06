import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { UserModule } from './User';
import { ReportModule } from './Report';
import { AssignmentModule } from './Assignment';

export default createStore({
  state: {},
  mutations: {},
  actions: {
  },
  modules: {
    User: UserModule,
    Report: ReportModule,
    Assignment: AssignmentModule,
  },
  plugins: [createPersistedState()],
});
