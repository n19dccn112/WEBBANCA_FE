import {isEmail} from "validator";
import Validate from "./Validate";
import React from 'react'

export const required = (value) => {
  if (!value) {
    return (
        <Validate
            isShow={true}
            type='invalid'
            message='Trường này không được trống!'
        />
    );
  }
  return ('');
};
export const email = value => {
  if (!isEmail(value)) {
    return (
        <Validate
            isShow={true}
            type='invalid'
            message='Đây không phải email.'
        />

    );
  }
};

export const username = value => {
  if (value.length < 3 || value.length > 20) {
    return (
        <Validate
            isShow={true}
            type='invalid'
            message='Tên đăng nhập phải từ 3 đến 20 ký tự'
        />
    );
  }
};

export const password = value => {
  if (value.length < 6 || value.length > 40) {
    return (
        <Validate
            isShow={true}
            type='invalid'
            message='Mật khẩu phải từ 6 đến 40 ký tự'
        />

    );
  }
};

export const phone = value => {
  const phoneNumberRegex = /^\d+$/;

  if (value.length === 10 && phoneNumberRegex.test(value)) {
    return null;
  } else {
    return (
        <Validate
            isShow={true}
            type='invalid'
            message='Số điện thoại không hợp lệ'
        />
    );
  }
};
export const isMatch = (value, props, components) => {
  const bothUsed = components.password[0].isUsed && components.confirm[0].isUsed;
  const bothChanged = components.password[0].isChanged && components.confirm[0].isChanged;

  if (bothChanged && bothUsed && components.password[0].value !== components.confirm[0].value) {
    return <Validate
        isShow={true}
        type='invalid'
        message="Mật khẩu không khớp!"
    />
  }
};