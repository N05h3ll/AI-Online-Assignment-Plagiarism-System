<template>

<div class="container-fluid ">
  <div v-if="!state.user">
    <!--welcome-->
    <div class="container">
      <h1>Welcome To Online Assigment,Plagiarsim System</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eget eros sapien.
        Pellentesque vulputate sed ligula quis dapibus. Proin varius metus ac lorem egestas, id
        aliquam eros dapibus.
      </p>
    </div>
    <!--/welocme-->
    <!--Buttons-->
    <div class="d-grid gap-2 d-md-block float-end">
      <router-link :to="{ name: 'Register' }">
        <button type="button" class="btn btn-success btn-lg me-sm-5">Register</button>
      </router-link>
      <router-link :to="{ name: 'Login' }">
        <button type="button" class="btn btn-success btn-lg me-sm-5 ">Login</button>
      </router-link>
      <button type="button" class="btn btn-outline-warning btn-lg me-sm-5">
        Continue as free user
      </button>
    </div>
  </div>

<!-- MODULE COORDINATOR -->
<module-coordinator v-if="state.user && state.user.accType == 'Module Coordinator'"/>
<student v-if="state.user && state.user.accType == 'Student'" :user="state.user" />
</div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import student from '../components/student.vue';
import moduleCoordinator from '../components/moduleCoordinator.vue';

const user = computed(() => useStore().state.User.user);
const listOfReports = computed(() => useStore().state.Report.listOfReports);
const listOfAssignments = computed(() => useStore().state.Assignment.listOfAssignments);
export default {
  name: 'Home',
  components: {
    moduleCoordinator,
    student,
  },
  mounted() {
    if (user.value) {
      const store = useStore();

      // eslint-disable-next-line no-inner-declarations
      (function getAllReports() {
        axios.get('http://127.0.0.1:3000/api/report/getallreports').then((res) => {
          store.dispatch('Report/setListOfReports', res.data);
        }).catch((error) => {
          console.log(error.response.data);
          store.dispatch('Report/setListOfReports', null);
        });
        setTimeout(getAllReports, 30000);
      }());

      // eslint-disable-next-line no-inner-declarations
      (function getAllAssignments() {
        axios.get('http://127.0.0.1:3000/api/assignment/getallassignments').then((res) => {
          store.dispatch('Assignment/setListOfAssignments', res.data);
          // console.log(res.data);
        }).catch((error) => {
          console.log(error.response.data);
          store.dispatch('Assignment/setListOfAssignments', null);
        });
        setTimeout(getAllAssignments, 30000);
      }());
    }
  },
  setup() {
    const router = useRouter();
    function getReports(reportID) {
      router.push({ name: 'Report', params: { repid: reportID } });
    }
    const state = ref({
      error: '',
      user,
      listOfReports,
      listOfAssignments,
    });
    return {
      state,
      getReports,
    };
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 50vh;
}
</style>
