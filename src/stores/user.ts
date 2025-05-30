// stores/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token'));
  const id = ref(localStorage.getItem('id'));
  const username = ref(localStorage.getItem('username'));
  const nickname = ref(localStorage.getItem('nickname'));
  const profilePictureUrl = ref(localStorage.getItem('profilePictureUrl'));
  const roles = ref(localStorage.getItem('roles'));

  const setUser = (data: any) => {
    token.value = data.token;
    id.value = data.id;
    username.value = data.username;
    nickname.value = data.nickname;
    profilePictureUrl.value = data.profilePictureUrl;
    roles.value = data.roles;

    localStorage.setItem('token', data.token);
    localStorage.setItem('id', data.id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('nickname', data.nickname);
    localStorage.setItem('profilePictureUrl', data.profilePictureUrl);
    localStorage.setItem('roles', data.roles);
  };

  const clearUser = () => {
    token.value = null;
    id.value = null;
    username.value = null;
    nickname.value = null;
    profilePictureUrl.value = null;
    roles.value = null;

    localStorage.setItem('token', '');
    localStorage.setItem('id', '');
    localStorage.setItem('username', '');
    localStorage.setItem('nickname', '');
    localStorage.setItem('profilePictureUrl', '');
    localStorage.setItem('roles', '');
  };

  return {
    token,
    id,
    username,
    nickname,
    profilePictureUrl,
    roles,
    setUser,
    clearUser
  };
});
