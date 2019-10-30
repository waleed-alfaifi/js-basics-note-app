const newNoteForm = document.getElementById('addNoteForm');
const editForm = document.getElementById('editNoteForm');
const notesList = document.getElementById('notes-list');

let saveBtn = document.getElementById('saveBtn'),
  deleteBtn = document.getElementById('deleteBtn'),
  cancelBtn = document.getElementById('cancelBtn'),
  titleEdit = document.getElementById('titleEdit'),
  bodyEdit = document.getElementById('bodyEdit');

let notes = [];
let count = localStorage.getItem('COUNT')
  ? JSON.parse(localStorage.getItem('COUNT'))
  : 0;

let tempNoteID = -1;

if (localStorage.getItem('NOTES')) {
  notes = JSON.parse(localStorage.getItem('NOTES'));
  refreshList();
}

// EVENTS
newNoteForm.addEventListener('submit', event => {
  event.preventDefault();

  let title = document.querySelector('[name=title]'),
    body = document.querySelector('[name=body]');

  // TODO: validate user's inputs.
  notes.push({
    id: count,
    title: title.value,
    body: body.value,
    dateOfCreation: new Date(),
  });

  title.value = '';
  body.value = '';

  count++;
  refreshList();
});

saveBtn.addEventListener('click', saveNote);
cancelBtn.addEventListener('click', () => {
  editForm.classList.add('hide');

  if (document.querySelector('#notes-list li.selected')) {
    document
      .querySelector('#notes-list li.selected')
      .classList.remove('selected');
  }
});
deleteBtn.addEventListener('click', deleteNote);

// FUNCTIONS
function refreshList() {
  notesList.innerHTML = '';

  notes.forEach(note => {
    let newListItem, newDateOfCreation, dateOfCreationText, itemHTML;

    newDateOfCreation = new Date(note.dateOfCreation);
    newListItem = document.createElement('li');
    newListItem.setAttribute('id', `note-${note.id}`);

    dateOfCreationText = `${newDateOfCreation.getFullYear()}/${newDateOfCreation.getMonth() +
      1}/${newDateOfCreation.getDate()}`;
    itemHTML = `<div>
                <p>
                    <strong>${note.title}</strong>
                    <em>(${dateOfCreationText})</em>
                </p>
            </div>`;

    newListItem.innerHTML = itemHTML;

    newListItem.innerHTML = itemHTML;
    newListItem.addEventListener('click', changeNote.bind(this, note.id));

    notesList.appendChild(newListItem);
  });

  localStorage.setItem('NOTES', JSON.stringify(notes));
  localStorage.setItem('COUNT', JSON.stringify(count));
}

function changeNote(id) {
  titleEdit.value = notes[id].title;
  bodyEdit.value = notes[id].body;

  tempNoteID = id;

  if (document.querySelector('#notes-list li.selected')) {
    document
      .querySelector('#notes-list li.selected')
      .classList.remove('selected');

    editForm.classList.add('hide');
  }

  document.querySelector(`#note-${id}`).classList.add('selected');
  editForm.classList.remove('hide');
}

function saveNote() {
  if (tempNoteID !== -1) {
    // TODO: Some user's input checking.
    notes[tempNoteID].title = titleEdit.value;
    notes[tempNoteID].body = bodyEdit.value;

    titleEdit.innerHTML = '';
    bodyEdit.innerHTML = '';

    editForm.classList.add('hide');

    refreshList();
  }
}

function deleteNote() {
  if (tempNoteID !== -1) {
    if (confirm('هل أنت متأكد من حذف الملاحظة؟')) {
      notes = notes.filter(note => note.id !== tempNoteID);

      editForm.classList.add('hide');
      if (document.querySelector('#notes-list li.selected')) {
        document
          .querySelector('#notes-list li.selected')
          .classList.remove('selected');
      }

      refreshList();
    }
  }
}
