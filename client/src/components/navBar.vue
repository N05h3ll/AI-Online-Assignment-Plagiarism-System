<template>
          <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item">
            <button class="btn btn-outline-light me-sm-3" type="submit">
              About Us
            </button>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-light me-sm-5" type="submit">
              Help!
            </button>
          </li>
            <li class="nav-item">
              <router-link :to="{name:'Home'}">
                <button
                class="btn btn-outline-warning me-sm-3"
                v-if="state.user">{{state.user.name}}</button>
                <button class="btn btn-outline-success me-sm-3" v-else>Login</button>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'Register'}">
                <button
                class="btn btn-danger me-sm-3" v-if="state.user" @click="logout">Logout</button>
                <button class="btn btn-success me-sm-3" v-else>Register</button>
              </router-link>
            </li>
        </ul>
</template>
<script>
import axios from 'axios';
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
    });
    async function getUser() {
      await axios.get('http://127.0.0.1:3000/api/user/user').then((res) => { store.dispatch('User/setUser', res.data); }).catch(() => { store.dispatch('User/setUser', null); });
    }
    onMounted(getUser);
    async function logout() {
      await axios.get('http://127.0.0.1:3000/api/user/logout').then(() => {
        store.dispatch('User/setUser', null);
        router.push('login');
      }).catch(() => { store.dispatch('User/setUser', null); });
    }
    return {
      state,
      getUser,
      logout,
    };
  },
};
</script>
