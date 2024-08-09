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
        <option key={user.id} value={user.id}>
          {user.name}
        </option>
      ))}
    </select>
  );
};

export default UserSelect;
