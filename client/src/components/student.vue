<template>
<!-- eslint-disable max-len  -->
<assignmentsSearch v-if="state.titleState === 'Assignments'"/>
<coursesSearch v-if="state.titleState === 'Courses'"/>
    <!-- STUDENT -->
    <div class="container-fluid row">
                <div class="row align-items-center">
            <div class="col">
              <div class="d-grid gap-3 col ">
                <button
                  v-bind:class="'btn btn-lg '+ state.courseButtonClass"
                  type="button"
                  @click="toggleCourses"
                >
                Courses</button>
                <button
                  v-bind:class="'btn btn-lg '+ state.assignmentButtonClass"
                  type="button"
                  @click="toggleAssignments"
                >
                  Assigment
                </button>
                <button
                  v-bind:class="'btn btn-lg '+ state.reportButtonClass"
                  type="button"
                  @click="toggleReports"
                >
                  Reports
                </button>
              </div>
            </div>
            <courses-container v-if="state.titleState === 'Courses'"/>
            <div class="col-9 rounded" id="registerationFormContanier"
            v-if="state.titleState !== 'Courses'">
              <h2 class="h2 m-3 text-dark">{{state.titleState}}</h2>
              <div class="table-responsive overflow-scroll">
                <!-- Reports TABLE -->
                <table class="table" v-if="state.titleState == 'Reports'">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col">Note</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="report in state.user.reports" :key="report">
                      <td>{{report.assignmentName}}</td>
                      <td>{{report.assignmentCode}}</td>
                      <td v-if="report.status !== 'Second Trial'"></td>
                      <td v-if="report.status === 'Second Trial'" class="badge bg-warning text-dark">Old Report, Second Trial Allowd</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="getReport(report._id)"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- END REPORTS TABLE -->
                <!-- ASSIGNMENT TABLE -->
                <table class="table" v-if="state.titleState == 'Assignments'">
                  <thead>
                    <tr>
                      <th scope="col">Status</th>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col">Submission Date</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="assignment in state.submittedAssignments" :key="assignment">
                      <td class="badge bg-success mt-sm-2"
                      v-if="assignment.status == 'Passed'">{{assignment.status}}</td>
                      <td class="badge bg-danger mt-sm-2"
                      v-if="assignment.status == 'Failed'">{{assignment.status}}</td>
                      <td class="badge bg-warning text-dark mt-sm-2"
                      v-if="assignment.status == 'Second Trial'">{{assignment.status}}</td>
                      <td class="badge bg-primary mt-sm-2 mx-sm-1"
                      v-if="assignment.status !== 'Second Trial' &&
                      assignment.reportID.isSecondTrial">Second Trial</td>
                      <td class="badge bg-warning text-dark mt-sm-2 mx-sm-1"
                        v-if="assignment.status !== 'Second Trial' &&
                        assignment.reportID.isSecondTrial && assignment.reportID.previousPercentage">
                        Last Percentage: {{assignment.reportID.previousPercentage.$numberDecimal.slice(0,5)}} %</td>
                      <td>{{assignment.assignmentName}}</td>
                      <td>{{assignment.assignmentCode}}</td>
                      <td>{{assignment.submissionDate}}</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="getAssignment(assignment.assignmentID, assignment.courseID[0])"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <!-- END ASSIGNMENT TABLE -->
              </div>
            </div>
          </div>
        <div>
        </div>
    </div>
</template>

<script>
/* eslint-disable max-len */
/* eslint-disable prefer-const */
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import coursesContainer from './coursesContainer.vue';
import assignmentsSearch from './assignmentsSearch.vue';
import coursesSearch from './coursesSearch.vue';

export default {
  components: {
    coursesContainer,
    assignmentsSearch,
    coursesSearch,
  },
  props: {
    user: {
      required: true,
      type: Object,
    },
  },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const state = ref({
      user: computed(() => {
        if (props.user) { return props.user; }
        return store.state.User.user;
      }),
      courseButtonClass: 'btn-warning',
      assignmentButtonClass: 'btn-primary',
      reportButtonClass: 'btn-primary',
      titleState: 'Courses',
      submittedStudents: null,
    });
    if (state.value.user) {
      let secondTrialAss = state.value.user.submittedAssignments.filter((x) => x.status === 'Second Trial');
      let notSecondTrialAss = state.value.user.submittedAssignments.filter((y) => y.status !== 'Second Trial');
      let difference = secondTrialAss.filter((y) => !notSecondTrialAss.some((i) => i.AssignmentID === y.AssignmentID));
      state.value.submittedAssignments = notSecondTrialAss.concat(difference);
    }
    function toggleAssignments() {
      state.value.assignmentButtonClass = 'btn-warning';
      state.value.reportButtonClass = 'btn-primary';
      state.value.courseButtonClass = 'btn-primary';
      state.value.titleState = 'Assignments';
    }
    function toggleReports() {
      state.value.assignmentButtonClass = 'btn-primary';
      state.value.reportButtonClass = 'btn-warning';
      state.value.courseButtonClass = 'btn-primary';
      state.value.titleState = 'Reports';
    }
    function toggleCourses() {
      state.value.courseButtonClass = 'btn-warning';
      state.value.assignmentButtonClass = 'btn-primary';
      state.value.reportButtonClass = 'btn-primary';
      state.value.titleState = 'Courses';
    }
    function getAssignment(assignmentID, courseID) {
      router.push({ name: 'Assignment', params: { assid: assignmentID, cID: courseID } });
    }
    function getReport(repID) {
      // console.log(assignmentID);
      router.push({ name: 'Report', params: { repid: repID } });
    }
    return {
      state,
      toggleAssignments,
      toggleReports,
      toggleCourses,
      getAssignment,
      getReport,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 50vh;
}
</style>
