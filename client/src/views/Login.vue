<template>
  <div class="container" id="middleContainer">
    <div class="row justify-content-center">
      <div class="col-md-6 rounded me-sm-3" id="registerationFormContanier">
        <h2 class="h2 m-3 text-dark">Login</h2>
        <div class="alert alert-warning" role="alert" v-if='state.error'>
          {{state.error}}
        </div>
        <form class="m-3" @submit.prevent="login">
          <div class="form-floating mb-3">
            <input
              type="email"
              class="form-control"
              id="floatingInput"
              v-model="state.email"
              placeholder="name@example.com"
              required
            />
            <label for="floatingInput">Email</label>
          </div>
          <div class="form-floating mb-3">
            <input
              type="password"
              class="form-control"
              id="floatingInput"
              v-model="state.password"
              placeholder="Password"
              required
            />
            <label for="floatingInput">Password</label>
          </div>
          <button type="submit" class="btn btn-success">Login</button>
          <button type="reset" class="btn btn-outline-danger ms-sm-4">Cancel</button>
        </form>
        <div v-if="User">{{ User.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

// @ is an alias to /src
import { useStore } from 'vuex';
import axios from 'axios';
import { useRouter } from 'vue-router';

axios.defaults.withCredentials = true;

const User = computed(() => useStore().state.User.user);
export default {
  name: 'Login',
  mounted() {
    if (User.value) {
      const router = useRouter();
      router.push('upload');
    }
  },
  setup() {
    const state = ref({
      email: '',
      password: '',
      error: '',
    });
    const router = useRouter();
    const store = useStore();
    async function login() {
      const loginData = new URLSearchParams();
      loginData.append('email', state.value.email);
      loginData.append('password', state.value.password);
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      await axios.post('http://127.0.0.1:3000/api/user/login', loginData, config).then((res) => {
        store.dispatch('User/setUser', res.data.user);
        router.push('/');
      }).catch((error) => {
        state.value.error = error.response.data.error;
      });
    }
    return {
      state,
      User,
      login,
    };
  },
  components: {},
};
</script>
