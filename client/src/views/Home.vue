<template>

<div class="container-fluid ">
  <div v-if="!state.user">
    <!--welcome-->
    <div class="container mt-5">
      <h1 class="text-white">Welcome To,  Online Assigment Plagiarsim System</h1>
      <p class="text-white">
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
<coursesHome v-if="state.user &&state.user.accType === 'Module Coordinator'"/>
<student v-if="state.user && state.user.accType == 'Student'" :user="state.user"/>
<TA v-if="state.user && state.user.accType === 'Teacher Assistant'"/>
</div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import student from '../components/student.vue';
import TA from '../components/TA.vue';
import coursesHome from '../components/coursesHome.vue';

export default {
  name: 'Home',
  components: {
    coursesHome,
    student,
    TA,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    function getReports(reportID) {
      router.push({ name: 'Report', params: { repid: reportID } });
    }
    const state = ref({
      error: '',
      user: computed(() => store.state.User.user),
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
