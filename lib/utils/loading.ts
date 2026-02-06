/**
 * Loading Progress Bar using NProgress
 * Shows a sleek loading bar at the top of the page
 */

import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
  minimum: 0.1,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
});

export const startLoading = () => {
  NProgress.start();
};

export const stopLoading = () => {
  NProgress.done();
};

export const setProgress = (progress: number) => {
  NProgress.set(progress);
};

export const incrementProgress = () => {
  NProgress.inc();
};

export default {
  start: startLoading,
  stop: stopLoading,
  set: setProgress,
  inc: incrementProgress,
};
