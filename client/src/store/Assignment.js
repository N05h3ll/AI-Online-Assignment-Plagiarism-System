/* eslint-disable import/prefer-default-export */
export const AssignmentModule = {
  namespaced: true,

  state: {
    singleAssignment: null,
    listOfAssignments: null,
  },

  // Mutations are functions that effect the STATE.
  mutations: {
    SET_ASSIGNMENT(state, assignment) {
      state.singleAssignment = assignment;
    },
    SET_LIST_OF_ASSIGNMENTS(state, listOfAssignments) {
      state.listOfAssignments = listOfAssignments;
    },
  },

  // Actions are functions that you call throughout your application that call mutations.
  actions: {
    setAssignment({ commit }, assignment) {
      commit('SET_ASSIGNMENT', assignment);
    },
    setListOfAssignments({ commit }, listOfAssignments) {
      commit('SET_LIST_OF_ASSIGNMENTS', listOfAssignments);
    },
  },
};
