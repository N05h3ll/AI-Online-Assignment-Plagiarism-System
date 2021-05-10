<template>
<div class="d-flex justify-content-center spinner"
v-if="state.loading">
<div class="align-self-center h1">
    Loading ...</div>
</div>
    <div class="col-10 rounded me-sm-3" id="registerationFormContanier">
  <h2 class="h2 m-3 text-dark">Users Pending Activation</h2>
  <div class="table-responsive overflow-scroll">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Account Type</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in state.listOfUsers" :key="user">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.accType }}</td>
          <td>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              @click="activate(user._id)"
              v-bind:disabled="user.active"
            >
              Activate
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>
import { ref, computed } from 'vue';
// import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: 'adminPAnel',

  setup() {
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
      loading: true,
    });
    axios.get(`${process.env.VUE_APP_BACKENDURL}/api/user/getinactiveusers`).then((response) => {
      state.value.listOfUsers = response.data;
      state.value.loading = false;
    });
    function activate(uid) {
      axios.get(`${process.env.VUE_APP_BACKENDURL}/api/user/activate/${uid}`).then(() => {
        state.value.loading = true;
        axios.get(`${process.env.VUE_APP_BACKENDURL}/api/user/getinactiveusers`).then((response) => {
          state.value.listOfUsers = response.data;
          state.value.loading = false;
        });
      });
    }
    return {
      state,
      activate,
    };
  },
};
</script>
