// With Jquerry
$(document).ready(function () {

    let edit = false;

    $('#task-result').hide();
    fetchTasks();

    // Search a task
    $('#search').keyup(function(e) {
        if($('#search').val()){
            let search = $('#search').val();
            $.ajax({
                url: 'task-search.php',
                type: 'POST',
                data: { search: search },
                success: function(response) {
                    let tasks = JSON.parse(response);
                    let template = '';
                    tasks.forEach( task =>{
                        template += `<li>${task['name']}</li>`;
                    });
                    $('#container').html(template);
                    $('#task-result').show();

                }
            })
        }else{
            $('#task-result').hide();
        }
    })

    // Create task

    $('#task-form').submit((event)=>{
        const postData = {
            name: $('#name').val(),
            description: $('#description').val(),
            id: $('#taskId').val()
        };

        let url = edit === false ? 'task-add-php' : 'task-edit.php';
        $.post(url, postData, (response)=>{
            $('#task-form').trigger('reset');
            fetchTasks();
        });
        event.preventDefault();
    });

    // Show all tasks
    function fetchTasks(){
        $.ajax({
            url: 'task-list.php',
            type: 'GET',
            success: (response) =>{
                let tasks = JSON.parse(response);
                let template = '';
                tasks.forEach((task) =>{
                    template +=
                        `<tr taskId="${task.id}">
                             <td >${task.id}</td>
                             <td><a href="#" class="task-item">${task.name}</a></td>
                             <td>${task.description}</td>
                             <td>
                                <button class="task-delete btn btn-danger">
                                    Delete
                                </button>
                             </td>
                         </tr>`;
                });
                $('#tasks').html(template);

            }

        })
    }

    // Delete tasks
    $(document).on('click', '.task-delete', function (){
        if(confirm('Are you sure you want to delete it? ')){
            let element = $(this)[0].parentElement.parentElement;
            let id = $(element).attr('taskId');
            $.post('task-delete.php', {id}, response => {
                fetchTasks();
            });
        }
    });


    // Update task
    $(document).on('click', '.task-item', function () {
        let element = $(this)[0].parentElement.parentElement;
        let id = $(element).attr('taskId');
        $.post('task-update.php', {id}, response =>{
            const task = JSON.parse(response);
            $('#name').val(task.name);
            $('#description').val(task.description);
            $('#taskId').val(task.id);

            edit = true;
        });
    });
});



// Vanilla JS
// document.getElementById('search').addEventListener("keyup", ()=>{
//    let xhr = new XMLHttpRequest();
//    let search = 'search='+document.getElementById('search').value;
//
//    xhr.open('POST', 'task-search.php');
//    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
//    xhr.send(search);
//
//    xhr.onreadystatechange = function () {
//         if(xhr.readyState == 4 && xhr.status == 200)
//             console.log(xhr.responseText);
//    }
// });

