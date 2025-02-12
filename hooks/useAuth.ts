import React from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";

// Import objects
import { UserManager } from "@/objects/user";

// Import states
import { userActions } from "@/states/redux/user";
import { UserSelectors } from "@/states/redux/user/selector";

// Import utils
import { OtherUtils } from "@/utils/other";
import { ValidatorUtils } from "@/utils/validators";

// Import types
import type { UserDataForAuthentication, NewUser } from "@/objects/user/type";
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
       * Hàm dùng để update dữ liệu tài khoản cho một người dùng.
       * @param emailName
       * @param password
       * @returns
       */
      rememberAccount(status?: boolean) {
        // Save token to store
        dispatch(userActions.updateCanRemember(Boolean(status)));
      },
      /**
       * Hàm này dùng để đăng nhập.
       * @param data Dữ liệu tài khoản của người dùng.
       */
      async signin(data: UserDataForAuthentication) {
        try {
          if ((data.email || data.username) && data.password) {
            // Phuong: check emailName is email or username
            let user;
            if (data.email && ValidatorUtils.isValidEmail(data.email)) {
              user = {
                email: data.email,
                password: data.password,
              };
            } else {
              user = {
                username: data.username,
                password: data.password,
              };
            }
            console.log("🚀 ~ file: useAuth.js:109 ~ signin ~ user:", user);
            // Phuong: call Api
            await UserManager.Api.signIn(user).then((data: any) => {
              console.log("🚀 ~ file: useAuth.js:113 ~ signin ~ res", data);
              const { user, token } = data;
              if (data) {
                // Phuong: Update user in persistent store
                dispatch(userActions.updateUser(user));

                // Check remember
              }
            });
          }
        } catch (error: any) {
          console.error(error.message);
        }
      },
      /**
       * Hàm dùng để đăng kí người dùng vào app.
       * @param data Dữ liệu đăng ký của người dùng.
       * @returns
       */
      async signup(data: NewUser) {
        try {
          const newUser = UserManager.createNewUser(data);
          // Phuong: call Api
          UserManager.Api.signUp(newUser).then((data) => {
            if (data) {
              console.log(
                "🚀 ~ file: SignupScreen.js:80 ~ signUpUserAPI ~ userData",
                data
              );
            }

            userActions.setUser(data);
          });
        } catch (error: any) {
          console.error(error.message);
        }
      },
    };

    OtherUtils.autoBind(actions);

    return actions;
  };

  return {
    /**
     * Hook này chỉ dùng để sử dụng các phương thức và state cho việc xác thực người dùng.
     * @returns
     */
    useAuth() {
      const all = useSelector(UserSelectors.selectAll);

      const dispatch = useDispatch();

      const actions = React.useMemo(() => createAuthActions(dispatch), []);

      return {
        ...all,
        authDispatchers: actions,
      };
    },

    /**
     * Hook này dùng cho việc sử dụng các phương thức cho việc xác thực người dùng.
     * @returns
     */
    useAuthActions() {
      const dispatch = useDispatch();

      const actions = React.useMemo(() => createAuthActions(dispatch), []);

      return actions;
    },

    /**
     * Hook này dùng cho việc sử dụng các state cho việc xác thực người dùng.
     * @returns
     */
    useAuthState() {
      return useSelector(UserSelectors.selectAll);
    },
  };
})();
