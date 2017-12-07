import Home from '../components/pages/Home.vue';
import Profile from '../components/pages/user/Profile.vue';
import Notifications from '../components/pages/user/Notifications.vue';
import Help from '../components/pages/Help.vue';
import NotFound404 from '../components/pages/404.vue';
import guestRoutes from './guest';
import mentorRoutes from './mentor';
import settingsRoutes from './settings';
import playlistsRoutes from './playlists';
import courseRoutes from './course';
import store from '../store/index';
import config from '../../config';
import VueRouter from 'vue-router';

const router = new VueRouter({
    linkExactActiveClass: 'is-active',
    linkActiveClass: 'is-active',
    routes: [
        {
            path: '/',
            component: Home,
            name: 'root',
            meta: { onlyAuth: true },
        },
        {
            path: '/profil/:username',
            component: Profile,
            name: 'profile',
            meta: { onlyAuth: true },
        },
        {
            path: '/notificari',
            component: Notifications,
            name: 'notifications',
            meta: { onlyAuth: true },
        },
        {
            path: '/ajutor',
            component: Help,
            name: 'help',
            meta: { onlyAuth: true },
        },
        {
            path: '/legal',
            // component: Help,
            name: 'legal',
        },
        ...guestRoutes,
        ...mentorRoutes,
        ...settingsRoutes,
        ...playlistsRoutes,
        ...courseRoutes,
        {
            path: '/404',
            component: NotFound404,
            name: '404',
        },
    ],
});

router.beforeEach((to, from, next) => {
    const user = store.state.user;
    if (user.logged) store.dispatch('getNotification');

    const check = () => {
        if (to.matched.some(record => record.meta.onlyAuth)) {
            if (!user.logged) next({ name: 'welcome' });
            else next();
        }
        if (to.matched.some(record => record.meta.onlyGuest)) {
            if (user.logged) next({ name: 'root' });
            else next();
        }
        if (to.matched.some(record => record.meta.onlyMentor)) {
            if (user.user.role < 2) next({ name: 'becomeMentor' });
            else if (!user.logged) next({ name: 'welcome' });
            else next();
        } else next();
    };
    if (user.logged) {
        check();
    } else {
        axios.post(config.url.USER).then(({ data }) => {
            if (data.success) {
                store.dispatch('setUser', data);
                // the user {}, has a notifications[] property
                store.dispatch('setNotification', data.user);
            }
            else store.dispatch('logout');
            check();
        });
    }
});

export default router;
