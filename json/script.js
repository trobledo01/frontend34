const postsContainer = document.getElementById('postsContainer');
        const postForm = document.getElementById('postForm');
        const titleInput = document.getElementById('title');
        const bodyInput = document.getElementById('body');
        const messageDiv = document.getElementById('message');
        
        // URL de la API
        const API_URL = 'https://jsonplaceholder.typicode.com';
        
        // Mostrar mensaje al usuario
        function showMessage(text, type) {
            messageDiv.textContent = text;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
        
        // Crear un elemento de tarjeta para un post
        function createCardElement(post) {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-id', post.id);
            
            card.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <div class="card-footer">
                    <button class="delete-btn" data-id="${post.id}">Eliminar</button>
                </div>
            `;
            
            // Añadir event listener al botón de eliminar
            card.querySelector('.delete-btn').addEventListener('click', deletePost);
            
            return card;
        }
        
        // Cargar todos los posts
        function loadPosts() {
            fetch(`${API_URL}/posts`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('No se pudieron cargar los posts');
                    }
                    return response.json();
                })
                .then(posts => {
                    // Limpiar el contenedor
                    postsContainer.innerHTML = '';
                    
                    // Añadir cada post como una tarjeta
                    posts.forEach(post => {
                        const card = createCardElement(post);
                        postsContainer.appendChild(card);
                    });
                })
                .catch(error => {
                    postsContainer.innerHTML = `<div class="error" style="grid-column: 1 / -1;">Error: ${error.message}</div>`;
                });
        }
        
        // Eliminar un post
        function deletePost(event) {
            const postId = event.target.getAttribute('data-id');
            const card = document.querySelector(`.card[data-id="${postId}"]`);
            
            fetch(`${API_URL}/posts/${postId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al eliminar el post');
                }
                
                // Eliminar la tarjeta de la interfaz
                card.remove();
                showMessage(`Post ${postId} eliminado correctamente`, 'success');
            })
            .catch(error => {
                showMessage(`Error: ${error.message}`, 'error');
            });
        }
        
        // Crear un nuevo post
        postForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const postData = {
                title: titleInput.value,
                body: bodyInput.value,
                userId: 1
            };
            
            fetch(`${API_URL}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al crear el post');
                }
                return response.json();
            })
            .then(newPost => {
                // Crear y añadir la nueva tarjeta al inicio
                const card = createCardElement(newPost);
                postsContainer.insertBefore(card, postsContainer.firstChild);
                
                // Limpiar el formulario
                postForm.reset();
                
                showMessage(`Nuevo post creado con ID: ${newPost.id}`, 'success');
            })
            .catch(error => {
                showMessage(`Error: ${error.message}`, 'error');
            });
        });
        
        // Cargar los posts cuando se carga la página
        document.addEventListener('DOMContentLoaded', loadPosts);