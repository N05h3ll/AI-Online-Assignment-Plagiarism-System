<template>
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
    <!--search box-->
    <div class="float-end me-sm-3" v-if="state.user">
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Assigment"
          aria-label="Assigment"
          aria-describedby="basic-addon1"
        />
        <span class="input-group-text" id="basic-addon1"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search"
            viewBox="0 0 16 16"
          >
            <path
              d="M11.742 10.344a6.5 6.5 0 1 0-1.397
              1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007
              1.007 0 0 0-.115-.1zM12
              6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"
            /></svg
        ></span>
      </div>
    </div>
    <!--/search box-->
    <!--assigment-->
    <div class="container" id="middleContainer" v-if="state.user">
      <div class="row">
        <div class="container">
          <div class="row align-items-center">
            <div class="col">
              <div class="d-grid gap-3 col-5 ">
                <button
                  class="btn btn-lg btn-primary"
                  type="button"
                  onclick="location.href='ListReports.html'"
                >
                  Reports
                </button>
                <button
                  class="btn btn-lg btn-warning"
                  type="button"
                  onclick="location.href='Assignments.html'"
                >
                  Assigment
                </button>
              </div>
            </div>
            <div class="col rounded me-sm-3" id="registerationFormContanier">
              <h2 class="h2 m-3 text-dark">Reports</h2>
              <div class="table-responsive">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Code</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="report in state.listOfReports" :key="report">
                      <td>A340 Survey</td>
                      <td>SW125-Assignemnt2</td>
                      <td>
                        <button
                          type="button"
                          class="btn btn-primary btn-sm"
                          @click="getReports(report._id)"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
    <router-link :to="{ name: 'Upload' }">
    <button class="btn btn-success float-end m-lg-5">Upload New Document</button>
    </router-link>
      </div>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const user = computed(() => useStore().state.User.user);
const listOfReports = computed(() => useStore().state.Report.listOfReports);
export default {
  name: 'Upload',
  mounted() {
    if (user.value) {
      const store = useStore();
      axios.get('http://127.0.0.1:3000/api/report/getallreports').then((res) => {
        console.log(res.data);
        store.dispatch('Report/setListOfReports', res.data);
      });
    }
  },
  setup() {
    const router = useRouter();
    function getReports(reportID) {
      // console.log(reportID);
      router.push({ name: 'Report', params: { repid: reportID } });
    }

    const state = ref({
      error: '',
      user,
      loading: false,
      listOfReports,
    });
    console.log(user);
    return {
      state,
      getReports,
    };
  },
};
</script>
