import { configureStore } from "@reduxjs/toolkit";
import onboardingReducer from "./features/Tenants/onboarding/onboarding.slice";

const store = configureStore({
  reducer: {
    onboarding: onboardingReducer,
  },
});

export default store;