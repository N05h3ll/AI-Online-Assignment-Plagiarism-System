<template>
  <!--HEADER-->
  <nav class="navbar position-relative navbar-expand-lg navbar-light bg-success">
    <div class="container-fluid">
      <a class="navbar-brand">
        <router-link :to="{name: 'Home'}">
          <img src="../public/LOGO.png" alt="OPAS LOGO" width="80" height="70" />
        </router-link>
      </a>
      <a class="position-absolute start-50" href="http://www.mti.edu.eg/">
        <img src="../public/MTI-Logo.png" alt="OPAS LOGO" width="100" height="70" />
      </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse justify-content-end"
        id="navbarSupportedContent"
      >
        <navBar />
      </div>
    </div>
  </nav>
  <!--/HEADER-->
  <router-view />
</template>

<script>

// @ is an alias to /src
import { useStore } from 'vuex';
import { computed } from 'vue';
import navBar from '@/components/navBar.vue';

export default {
  name: 'App',
  components: { navBar },
  setup() {
    const store = useStore();
    const user = computed(() => store.state.User.user);
    return {
      user,
    };
  },
};
</script>
