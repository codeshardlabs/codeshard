import { compressData, decompressData } from "@/lib/utils";
 
  self.onmessage = function(e) {
    const { action, fileId, content } = e.data;
  
    switch (action) {
      case 'save':
        handleSave(fileId, content);
        break;
      case 'load':
        handleLoad(fileId);
        break;
      case 'delete':
        handleDelete(fileId);
        break;
      case 'list':
        handleList();
        break;
      default:
        self.postMessage({ status: 'error', error: 'Unknown action' });
    }
  };
  
  function handleSave(fileId, template,  content) {
    try {
      const compressedContent = compressData(content);
      localStorage.setItem(`${template}_file_${fileId}`, compressedContent);
      self.postMessage({ status: 'success', action: 'save', fileId });
    } catch (error) {
      self.postMessage({ status: 'error', action: 'save', fileId, error: error.message });
    }
  }
  
  function handleLoad(template, fileId) {
    try {
      const compressedContent = localStorage.getItem(`${template}_file_${fileId}`);
      if (compressedContent === null) {
        throw new Error('File not found');
      }
      const content = decompressData(compressedContent);
      self.postMessage({ status: 'success', action: 'load', fileId, content });
    } catch (error) {
      self.postMessage({ status: 'error', action: 'load', fileId, error: error.message });
    }
  }
  
  function handleDelete(template, fileId) {
    try {
      localStorage.removeItem(`${template}_file_${fileId}`);
      self.postMessage({ status: 'success', action: 'delete', fileId });
    } catch (error) {
      self.postMessage({ status: 'error', action: 'delete', fileId, error: error.message });
    }
  }
  
  function handleList(template) {
    try {
      const files = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('${template}_file_')) {
          files.push(key.substring(template.length+ 6)); // Remove 'file_' prefix
        }
      }
      self.postMessage({ status: 'success', action: 'list', files });
    } catch (error) {
      self.postMessage({ status: 'error', action: 'list', error: error.message });
    }
  }