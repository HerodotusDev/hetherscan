export const createNewModal = (ctx: {
  id: string;
  inner: string;
  title: string;
}) => {
  let newModal = document.createElement("div");
  newModal = document.createElement("div");
  newModal.classList.add("modal", "fade");
  newModal.setAttribute("tabindex", "-1");
  newModal.id = ctx.id;
  newModal.setAttribute("tabindex", "-1");
  newModal.setAttribute("role", "dialog");

  newModal.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
          <h5 class="modal-title">${ctx.title}</h5>
          <button type="button" class="btn-close" aria-label="Close" id="close${ctx.id}"></button>
      </div>
        <div class="modal-body">
          ${ctx.inner}
        </div>
        <div class="modal-footer">
          <button id="submit${ctx.id}" class="btn btn-primary">Submit</button>
        </div>
        </div>
      </div>
    </div>
    `;

  return newModal;
};

export const generateCheckboxes = (properties: string[]) => {
  return properties
    .map(
      (property) => `
        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="${property}" id="flexCheck${property}" checked>
          <label class="form-check-label" for="flexCheck${property}">
            ${property}
          </label>
        </div>
      `
    )
    .join("");
};
