<template>
  <div>
    <b-navbar-nav v-if="$store.state.user" class="header-user-dropdown ml-auto">
      <b-nav-item-dropdown right>
        <template slot="button-content">
          <img v-if="$store.state.user.avatar" class="avatar" :src="$store.state.user.avatar">
          <span>{{$store.state.user.name}}</span>
        </template>
        <b-dropdown-item to="/profile">Profile</b-dropdown-item>
        <b-dropdown-item href="/logout">Signout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <nuxt />
  </div>
</template>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.header-user-dropdown {
  cursor: pointer;
  position: absolute;
  right: 15px;
  top: 15px;
  background-color: #fff;
  border-radius: 3px;
  margin: 0;
  line-height: 16px;
  font-size: 16px;
  text-align: center;
  opacity: 0.5;
  z-index: 10;
  &:hover {
    opacity: 1;
  }
  a.dropdown-toggle {
    color: #333;
    padding-right: 15px;
    padding-left: 7px;
    min-height: 33px;
    &::after {
      vertical-align: 0.2em;
      margin-left: 7px;
    }
    img.avatar {
      width: 29px;
      border-radius: 29px;
    }
    span {
      padding: 13px 0 13px 7px;
    }
  }
  a.dropdown-item {
    padding: 10px 15px;
  }
}
</style>
