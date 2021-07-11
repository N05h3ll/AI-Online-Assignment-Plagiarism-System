<template>
          <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item">
            <button class="btn btn-link text-light me-sm-3" type="submit">
              About Us
            </button>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'Help'}">
          <button class="btn btn-link text-light   me-sm-5" type="submit">
              Help!
            </button>
        </router-link>
          </li>
            <li class="nav-item" v-if="state.user">
              <router-link :to="{name:'Profile', params: {uID: state.user._id}}">
                <button
                class="btn btn-outline-light me-sm-3"
                v-if="state.user">{{state.user.name}}</button>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{name: 'Register'}">
                <button
                class="btn btn-danger me-sm-3" v-if="state.user" @click="logout">Logout</button>
              </router-link>
            </li>
        </ul>
</template>
<script>
import axios from 'axios';
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const store = useStore();
    const state = ref({
      user: computed(() => store.state.User.user),
    });
    (async function getUser() {
      await axios.get(`${process.env.VUE_APP_BACKENDURL}/api/user/user`).then((res) => {
        console.log(res.data);
        store.dispatch('User/setUser', res.data);
      }).catch(() => {
        store.dispatch('User/setUser', null);
        // eslint-disable-next-line no-underscore-dangle
        if (router.currentRoute._value.name !== 'Login' && router.currentRoute._value.name !== 'Register' && router.currentRoute._value.name !== 'Help') {
          router.push({ name: 'Home' });
        }
      });
      setTimeout(getUser, 2000);
    }());
    async function logout() {
      await axios.get(`${process.env.VUE_APP_BACKENDURL}/api/user/logout`).then(() => {
        store.dispatch('User/setUser', null);
        router.push('login');
      }).catch(() => { store.dispatch('User/setUser', null); });
    }
    return {
      state,
      logout,
    };
  },
};
</script>
