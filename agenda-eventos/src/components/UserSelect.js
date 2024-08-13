// UserSelect.js
import React from 'react';

const UserSelect = ({ id, name, users, defaultValue, className, required }) => {
  return (
    <select
      id={id}
      name={name}
      className={className}
      defaultValue={defaultValue}
      required={required}
      multiple
    >
      {users.map((user) => (
        <option key={user._id} value={user._id}>
          {user.username}
        </option>
      ))}
    </select>
  );
};

export default UserSelect;
