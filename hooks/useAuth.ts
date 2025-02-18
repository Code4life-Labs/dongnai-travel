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
        dispatch(userActions.setCanRemember(Boolean(status)));
      },

      /**
       * Hàm này dùng để đăng nhập.
       * @param data Dữ liệu tài khoản của người dùng.
       */
      async signin(data: any) {
        try {
          console.log("Data:", data);
          if (
            (data.emailName && data.password) ||
            (data.emailName && data.token)
          ) {
            // Phuong: check emailName is email or username
            let signInData;
            if (data.emailName && ValidatorUtils.isValidEmail(data.emailName)) {
              signInData = {
                email: data.emailName,
                password: data.password,
              };
            } else if (data.emailName && data.password) {
              signInData = {
                username: data.emailName,
                password: data.password,
              };
            } else {
              signInData = {
                username: data.emailName,
                token: data.token,
              };
            }

            // Phuong: call Api
            const responsePayload = await UserManager.Api.signIn(signInData);
            const responseData = responsePayload.data;

            dispatch(userActions.setUser(responseData.user));
            if (responseData.token) {
              dispatch(
                userActions.setRememberedUserData({
                  user: responseData.user,
                  token: responseData.token,
                })
              );
            }
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
          const responsePayload = await UserManager.Api.signUp(newUser);
          const responseData = responsePayload.data;

          dispatch(userActions.setUser(responseData.user));
          dispatch(
            userActions.setRememberedUserData({
              user: responseData.user,
              token: responseData.token,
            })
          );
        } catch (error: any) {
          console.error(error.message);
        }
      },

      setToken(token: string | null = null) {
        dispatch(userActions.setToken(token));
      },

      /**
       * Dùng để xoá thông tin người dùng khỏi ứng dụng.
       */
      signOut() {
        dispatch(userActions.reset());
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
