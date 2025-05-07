const fs = require('fs').promises;

class DeleteFileService {
  async safeDeleteFile(filePath) {
    try {
      try {
        await fs.access(filePath);
      } catch (accessErr) {
        console.warn(`Файл не найден: ${filePath}`);
        return false;
      }
      // Удаление файла
      await fs.unlink(filePath);
      console.log(`Файл успешно удален: ${filePath}`);
      return true;
    } 
    catch (err) {
      console.error('Ошибка удаления файла:', err);
      throw err;
    }
  }
}

module.exports = new DeleteFileService();