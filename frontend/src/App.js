import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tree, setTree] = useState(null);
  const [exportedTree, setExportedTree] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/tree/')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch tree data');
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          setTree(data[0].data); 
        } else {
          console.error('No tree data found in the database');
        }
      })
      .catch((error) => console.error('Error fetching tree data:', error))
      .finally(() => setLoading(false));
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('tree', JSON.stringify(data));
    setTree(data);
  };

  const addChild = (parent) => {
    const childData = parent.data || 'Data';
    if (parent.data) {
      parent.children = [{ name: 'New Child', data: childData }];
      delete parent.data;
    } else {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push({ name: 'New Child', data: childData });
    }
    saveToLocalStorage({ ...tree });
  };

  const updateData = (node, value) => {
    node.data = value;
    saveToLocalStorage({ ...tree });

    const payload = { name: 'root', data: tree }; 

    fetch('http://127.0.0.1:8000/tree/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update data');
        }
        return response.json();
      })
      .then((updatedNode) => {
        console.log('Updated Node:', updatedNode);
      })
      .catch((error) => console.error('Error updating data:', error));
  };

  const toggleCollapse = (node) => {
    node.collapsed = !node.collapsed;
    setTree({ ...tree });
  };

  const renderTree = (node) => (
    <div className="tag-container">
      <div className="tag-header d-flex align-items-center">
        <button
          className="btn btn-sm btn-light me-2"
          onClick={() => toggleCollapse(node)}
        >
          {node.collapsed ? '>' : 'v'}
        </button>
        {node.name}
        <button
          className="btn btn-sm btn-light ms-auto"
          onClick={() => addChild(node)}
        >
          Add Child
        </button>
      </div>
      {!node.collapsed && (
        <div className="tag-body ms-4">
          {node.data ? (
            <div className="d-flex align-items-center">
              data:
              <input
                type="text"
                className="form-control my-2"
                value={node.data}
                onChange={(e) => updateData(node, e.target.value)}
              />
            </div>
          ) : (
            Array.isArray(node.children) &&
            node.children.map((child, index) => (
              <div key={index}>{renderTree(child)}</div>
            ))
          )}
        </div>
      )}
    </div>
  );

  const exportTree = () => {
    const treeData = JSON.stringify(tree, null, 2);
    setExportedTree(treeData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="my-4">Nested Tree</h1>
      {tree ? renderTree(tree) : <div>No tree data available</div>}
      <button className="btn btn-info mt-3" onClick={exportTree}>
        Export
      </button>
      {exportedTree && (
        <pre className="mt-3 p-3 bg-light border rounded">
          {exportedTree}
        </pre>
      )}
    </div>
  );
}

export default App;

