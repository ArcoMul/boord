<template>
  <div class="avatars">
    <span v-for="user in users" :key="user._id" :title="user.name">
      <img :src="user.avatar" />
      <span class="remove" @click="$emit('onRemove', user)">
        <span class="icon" />
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    users: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatars {
  margin: 0 0 15px 0;
  span {
    position: relative;
    border-radius: 40px;
    width: 40px;
    height: 40px;
    display: block;
    &:hover .remove {
      display: block;
    }
    img {
      width: 100%;
      border-radius: 40px;
    }
    .remove {
      border-radius: 40px;
      position: absolute;
      left: 0;
      top: 0;
      background-color: rgba(0, 0, 0, 0.5);
      width: 40px;
      height: 40px;
      cursor: pointer;
      display: none;
      .icon {
        background-color: #fff;
        mask-image: url('/remove.svg');
        width: 20px;
        height: 20px;
        display: block;
        margin: 10px;
      }
    }
  }
}
</style>