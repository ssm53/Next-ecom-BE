// price one maybe not the best yet

export function validateUpload(input) {
  const validationErrors = {};

  if (!("title" in input) || input["title"].length == 0) {
    validationErrors["title"] = "cannot be blank";
  }

  if (!("price" in input) || input["price"].length == 0) {
    validationErrors["price"] = "cannot be blank";
  }

  if (!("description" in input) || input["description"].length == 0) {
    validationErrors["description"] = "cannot be blank";
  } else if ("description" in input && input["description"].length < 8) {
    validationErrors["description"] = "should be at least 8 characters";
  }

  // if (!("password" in input) || input["password"].length == 0) {
  //   validationErrors["password"] = "cannot be blank";
  // } else if ("password" in input && input["password"].length < 8) {
  //   validationErrors["password"] = "should be at least 8 characters";
  // }

  return validationErrors;
}
