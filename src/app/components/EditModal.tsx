import React from "react";

function EditModal({ userToEdit, handleSubmit, setUserToEdit, errors }) {
  return (
    <form
      onSubmit={handleSubmit}
      className='absolute top-[50%] left-[50%] translate-[-50%] grid place-self-center gap-2  bg-accent text-primary shadow-2xl  p-4  z-10'
    >
      {Object.keys(userToEdit).map((key) => {
        if (key === "id") {
          return (
            <>
              <label htmlFor={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              <input
                type='text'
                readOnly
                id={key}
                name={key}
                value={userToEdit[key] || ""}
                className='bg-gray-600 p-2 w-full rounded-md'
                onChange={(e) =>
                  setUserToEdit({ ...userToEdit, [key]: e.target.value })
                }
              />
            </>
          );
        }
        return (
          <div key={key}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}:
            </label>
            <input
              type='text'
              id={key}
              name={key}
              value={userToEdit[key] || ""}
              className='bg-gray-600 p-2 w-full rounded-md'
              onChange={(e) =>
                setUserToEdit({ ...userToEdit, [key]: e.target.value })
              }
            />
            <br />
            {errors && console.log(errors[key] && errors[key][0])}
            {errors && errors[key] && errors[key][0] && (
              <p className='bg-red-500 p-2 font-bold rounded-md'>
                {errors[key][0]}
              </p>
            )}
          </div>
        );
      })}

      <button
        type='submit'
        className='bg-primary text-secondary dark:bg-secondary-dark dark:text-accent-dark p-2 rounded-md'
      >
        Save Changes
      </button>
    </form>
  );
}

export default EditModal;
