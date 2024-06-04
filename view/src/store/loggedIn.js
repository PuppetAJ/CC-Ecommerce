import { create } from 'zustand';

export const useLoginStore = create((set) => ({
  loggedIn: undefined,
  setLoggedIn: (loggedIn) => set({ loggedIn }),
  checkLoggedIn: async () => {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    if (response.status === 200) {
      // console.log('logged in');
      // console.log(response);
      set({ loggedIn: true });
    } else {
      // console.log('not logged in');
      // console.log(response);
      set({ loggedIn: false });
    }
  },
}));
