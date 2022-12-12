
const TaskSection = (props) => {
    return (
        <div className="task-section">
            <TaskForm />
            
            <div className="task-content">
                <div className="card-header">
                    <div className="text-card">
                        <div className="color-div"></div>
                        <div className="card-text">
                            <div>Task Status</div>
                        </div>
                    </div>
                </div>

                <TaskList />
            </div>
        </div>
    )
}

const TaskForm = (props) => {
    return (
        <div className="task-form">
            <div className="card-header">
                <div className="text-card">
                    <div className="color-div"></div>
                    <div className="card-text">
                        <div>Add New Task</div>
                    </div>
                </div>
            </div>
            

            <form>
                <div className="form-group">
                    <label htmlFor="task-name">Task Name</label>
                    <input type="text" name="task" id="task" className="form-control"/>
                </div>

                <div className="form-group">
                    <label htmlFor="date">Date of Completion</label>
                    <input name="date" type="date" id="date" className="form-control"/>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select className="form-control" name="category">
                        <option value="Survey">Survey</option>
                    </select>
                </div>

                <div className="submit-section">
                    <button type="submit" className="btn btn-submit">Add</button>
                </div>
            </form>
        </div>
    );
}
// Save the tasks on  local storage

const TaskList = (props) => {
    return (
        <div className="task-list">
            {[0,1,2,3].map(item => <TaskItem key={item}/>)}
        </div>
    )
}

const TaskItem = (props) => {
    return (
        <div className="task-item">
            <div className="color-div"></div>
            <div className="task-content">
                <div className="card-text">
                    <div>Task Name</div>
                    <span>:</span>
                    <div>Site Visitation in Zone 1</div>
                </div>

                <div className="card-text">
                    <div>Category</div>
                    <span>:</span>
                    <div>Survey</div>
                </div>

                <div className="card-text">
                    <div>Assign To</div>
                    <span>:</span>
                    <div>Officer 1</div>
                </div>
            </div>
        </div>
    );
}

export default TaskSection;