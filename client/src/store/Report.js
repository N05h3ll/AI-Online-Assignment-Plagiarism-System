/* eslint-disable import/prefer-default-export */
export const ReportModule = {
  namespaced: true,

  state: {
    singleReport: null,
    listOfReports: null,
  },

  // Mutations are functions that effect the STATE.
  mutations: {
    SET_REPORT(state, report) {
      state.report = report;
    },
    SET_LIST_OF_REPORTS(state, listOfReports) {
      state.listOfReports = listOfReports;
    },
  },

  // Actions are functions that you call throughout your application that call mutations.
  actions: {
    setReport({ commit }, report) {
      commit('SET_REPORT', report);
    },
    setListOfReports({ commit }, listOfReports) {
      commit('SET_LIST_OF_REPORTS', listOfReports);
    },
  },
};
