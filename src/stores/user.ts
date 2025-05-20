// stores/user.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
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

  return {
    token,
    id,
    username,
    nickname,
    profilePictureUrl,
    roles,
    setUser
  };
});
