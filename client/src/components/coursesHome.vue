<template>
<coursesSearch/>
    <div class="container-fluid row" id="middleContainer">

          <div class="row align-items-center justify-content-center">
<coursesContainer/>
          </div>
    </div>
</template>

<script>
import coursesContainer from './coursesContainer.vue';
import coursesSearch from './coursesSearch.vue';

export default {
  components: {
    coursesContainer,
    coursesSearch,
  },
};
</script>

<style scoped>
.table-responsive {
  max-height: 65vh;
}
</style>
