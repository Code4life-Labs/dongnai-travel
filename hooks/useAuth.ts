import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAuthenticated } from "redux/user/UserSlice";

// Import objects
import { UserManager } from "@/objects/user";

// Import states
import {
  updateCurrentWareHouseState,
  isFirstTimeLaunchSelector,
  rememberdAccountSelector,
} from "@/states/redux/";
import {
  selectCurrentUser,
  selectUserRole,
  updateUserRoleState,
  updateCurrentUser,
} from "redux/user/UserSlice";
import { updateCurrentNotifs } from "redux/notifications/NotificationsSlice";

import moment from "moment";

import FunctionsUtility from "@/utils/functions";
import { USER_ROLES } from "@/utils/constants";
import { EMAIL_RULE } from "@/utils/validators";

// Import types
import type {
  UserRoles,
  ActionProps,
  AuthenticateOptionsProps,
  UserForAuthProps,
} from "types/index.d.ts";
import type { Dispatch } from "@reduxjs/toolkit";

export const { useAuth, useAuthState, useAuthActions } = (function () {
  /**
   * Tạo các actions cho auth
   * @param dispatch
   * @returns
   */
  let createAuthActions = function (dispatch: Dispatch) {
    let actions = {
      /**
       * Hàm dùng để để update dữ liệu về lần đầu người dùng vào app.
       * @param status
       * @returns
       */
      updateIsFirstTimeLaunch(status?: boolean) {
        dispatch(
          updateCurrentWareHouseState({ isFirstTimeLaunch: Boolean(status) })
        );
      },
      /**
       * Hàm dùng để update dữ liệu tài khoản cho một người dùng.
       * @param emailName
       * @param password
       * @returns
       */
      rememberAccount(emailName: string, password: string) {
        dispatch(updateCurrentWareHouseState({ emailName, password }));
      },
      /**
       * Hàm dùng để update thủ công `role` cho `user`.
       * @param {UserRoles} role
       * @returns
       */
      updateUserRole(role) {
        dispatch(updateUserRoleState(role));
      },
      /**
       * Hàm này dùng để đăng nhập.
       * @param {UserForAuthProps} data Dữ liệu tài khoản của người dùng.
       * @param {AuthenticateOptionsProps} options Gọi sau khi đăng nhập thành công.
       */
      async signin(data, options) {
        try {
          if (
            options &&
            options.checkConditionFirst &&
            !options.checkConditionFirst()
          )
            return;

          if (data.emailName && data.password) {
            // Phuong: check emailName is email or username
            let user;
            if (FunctionsUtility.validateRegex(data.emailName, EMAIL_RULE)) {
              user = {
                email: data.emailName,
                password: data.password,
              };
            } else {
              user = {
                username: data.emailName,
                password: data.password,
              };
            }
            console.log("🚀 ~ file: useAuth.js:109 ~ signin ~ user:", user);
            // Phuong: call Api
            await UserManager.Api.signIn(user)
              .then((res) => {
                console.log("🚀 ~ file: useAuth.js:113 ~ signin ~ res", res);
                if (res) {
                  // Phuong: Update user in persistent store
                  dispatch(updateCurrentUser(res.fullInfoUser));
                  dispatch(updateCurrentNotifs(res.notifs));
                  // Phuong: check rememberme
                  if (options && options.callWhenResolve)
                    options.callWhenResolve(data);
                }
              })
              .catch((error) => {
                if (options && options.callWhenReject) options.callWhenReject();
              });
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      /**
       * Hàm dùng để đăng kí người dùng vào app.
       * @param {any} data Dữ liệu đăng ký của người dùng.
       * @param {AuthenticateOptionsProps} options Là một mảng các hàm để chạy trước khi signup
       * @returns
       */
      async signup(data, options) {
        try {
          if (
            options &&
            options.checkConditionFirst &&
            !options.checkConditionFirst()
          )
            return;

          const birthday =
            moment(data.birthday, "DD/MM/YYYY").toDate().getTime() / 1000;
          const userSignUp = {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            birthday: birthday,
            username: data.username,
            password: data.password,
            confirmPassword: data.confirmPassword,
          };
          // Phuong: call Api
          signUpUserAPI(userSignUp)
            .then((res) => {
              if (res) {
                console.log(
                  "🚀 ~ file: SignupScreen.js:80 ~ signUpUserAPI ~ userData",
                  res
                );
                // Phuong: move to SigninScreen screen
                if (options && options.callWhenResolve)
                  options.callWhenResolve();
              }
            })
            .catch((error: any) => {
              if (options && options.callWhenReject) options.callWhenReject();
            });
        } catch (error: any) {}
      },
      /**
       * Hàm để lấy thông tin người dùng bằng cách xác thực người dùng thông qua sign in.
       * @param {UserForAuthProps} data
       */
      async getFullUserInfo(user: any) {
        // Nếu mà có isGetFullUserInfo tức là nên call api để reset lại user mặc dù đã có trong state
        // lấy emailname vs password tỏng warehouse
        await this.signin(user.email, user.password);
      },
    };

    FunctionsUtility.autoBind(actions);

    return actions;
  };

  return {
    /**
     * Hook này chỉ dùng để sử dụng các phương thức và state cho việc xác thực người dùng.
     * @returns
     */
    useAuth() {
      let isAuthenticated = useSelector(selectIsAuthenticated);
      let isFirstTimeLaunch = useSelector(isFirstTimeLaunchSelector);
      let rememberedAccount = useSelector(rememberdAccountSelector);
      let userRole = useSelector(selectUserRole);
      let user = useSelector(selectCurrentUser);

      let dispatch = useDispatch();

      let actions = React.useMemo(() => createAuthActions(dispatch), []);

      return {
        isAuthenticated,
        isFirstTimeLaunch,
        rememberedAccount,
        userRole,
        user,
        ...actions,
      };
    },

    /**
     * Hook này dùng cho việc sử dụng các phương thức cho việc xác thực người dùng.
     * @returns
     */
    useAuthActions() {
      let dispatch = useDispatch();

      let actions = React.useMemo(() => createAuthActions(dispatch), []);

      return actions;
    },

    /**
     * Hook này dùng cho việc sử dụng các state cho việc xác thực người dùng.
     * @returns
     */
    useAuthState() {
      let isAuthenticated = useSelector(selectIsAuthenticated);
      let isFirstTimeLaunch = useSelector(isFirstTimeLaunchSelector);
      let rememberedAccount = useSelector(rememberdAccountSelector);
      let userRole = useSelector(selectUserRole);
      let user = useSelector(selectCurrentUser);

      return {
        isAuthenticated,
        isFirstTimeLaunch,
        rememberedAccount,
        userRole,
        user,
      };
    },
  };
})();
