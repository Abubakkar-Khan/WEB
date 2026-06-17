import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';

interface DOMNode {
  id: string;
  tag: string;
  content: string;
  children: DOMNode[];
}

export const DOMSimulator: React.FC = () => {
  const [tree, setTree] = useState<DOMNode>({
    id: 'root',
    tag: 'html',
    content: '',
    children: [
      {
        id: 'body',
        tag: 'body',
        content: '',
        children: [
          { id: 'p1', tag: 'p', content: 'Paragraph one', children: [] },
          { id: 'p2', tag: 'p', content: 'Paragraph two', children: [] },
        ]
      }
    ]
  });
  
  const [selectedNodeId, setSelectedNodeId] = useState<string>('p1');
  const [newNodeText, setNewNodeText] = useState('New Node');
  const [actionLog, setActionLog] = useState<string[]>([]);

  const logAction = (msg: string) => {
    setActionLog(prev => [msg, ...prev].slice(0, 5));
  };

  const findParent = (root: DOMNode, id: string): DOMNode | null => {
    if (root.children.some(c => c.id === id)) return root;
    for (const child of root.children) {
      const found = findParent(child, id);
      if (found) return found;
    }
    return null;
  };

  const createNode = (): DOMNode => ({
    id: 'node_' + Math.random().toString(36).substr(2, 5),
    tag: 'div',
    content: newNodeText,
    children: []
  });

  const handleAppend = () => {
    setTree(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const target = findNode(newTree, selectedNodeId);
      if (target) {
        target.children.push(createNode());
        logAction(`Appended child to <${target.tag}>`);
      }
      return newTree;
    });
  };

  const handleRemove = () => {
    if (selectedNodeId === 'root' || selectedNodeId === 'body') {
      logAction(`Cannot remove root/body nodes`);
      return;
    }
    setTree(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const parent = findParent(newTree, selectedNodeId);
      if (parent) {
        parent.children = parent.children.filter(c => c.id !== selectedNodeId);
        setSelectedNodeId(parent.id);
        logAction(`Removed node. Parent <${parent.tag}> selected.`);
      }
      return newTree;
    });
  };

  const findNode = (root: DOMNode, id: string): DOMNode | null => {
    if (root.id === id) return root;
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
    return null;
  };

  const renderTree = (node: DOMNode) => {
    const isSelected = node.id === selectedNodeId;
    return (
      <div 
        key={node.id} 
        onClick={(e) => { e.stopPropagation(); setSelectedNodeId(node.id); }}
        style={{
          marginLeft: '16px',
          padding: '8px',
          border: isSelected ? '1px solid var(--nothing-text)' : '1px solid var(--nothing-border)',
          backgroundColor: isSelected ? 'rgba(255,255,255,0.05)' : 'transparent',
          cursor: 'pointer',
          marginTop: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px'
        }}
      >
        <span style={{ color: 'var(--nothing-text-muted)' }}>&lt;{node.tag}&gt;</span>
        {node.content && <span style={{ margin: '0 8px' }}>{node.content}</span>}
        
        {node.children.map(renderTree)}
        
        {node.children.length > 0 && <div style={{ color: 'var(--nothing-text-muted)', marginTop: '4px' }}>&lt;/{node.tag}&gt;</div>}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>DOM Tree Operations</CardTitle>
      </CardHeader>
      <CardBody style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div style={{ border: '1px solid var(--nothing-border)', padding: '16px', background: '#050505', overflowY: 'auto', minHeight: '300px' }}>
          {renderTree(tree)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--nothing-text-muted)', letterSpacing: '0.1em' }}>NEW NODE TEXT</label>
            <input 
              value={newNodeText} 
              onChange={(e) => setNewNodeText(e.target.value)}
              style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', color: 'var(--nothing-text)', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <Button onClick={handleAppend} variant="secondary">Append Child</Button>
            <Button onClick={handleRemove} variant="danger">Remove Node</Button>
          </div>

          <div style={{ background: 'var(--nothing-bg)', border: '1px solid var(--nothing-border)', padding: '12px', flexGrow: 1 }}>
            <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--nothing-text-muted)', marginBottom: '8px' }}>ACTION LOG</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--nothing-text)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {actionLog.map((log, i) => (
                <li key={i} style={{ opacity: 1 - (i * 0.2) }}>&gt; {log}</li>
              ))}
              {actionLog.length === 0 && <li style={{ color: 'var(--nothing-text-dim)' }}>Select a node and perform an operation.</li>}
            </ul>
          </div>
        </div>

      </CardBody>
    </Card>
  );
};
