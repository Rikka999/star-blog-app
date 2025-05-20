import axiosUtil from '@/utils/axios';
import axios from 'axios';

interface UploadTokenResponse {
  accessKeyId: string;
  policy: string;
  signature: string;
  dir: string;
  host: string;
}

export class OssUploader {
  static async upload(
    file: File,
    type: 'profilePicture' | 'postCover' | 'postImage'
  ): Promise<string> {
    const { data } = await axiosUtil.get('/api/common/oss/upload-token', {
      params: { type },
      headers: { noAuth: true },
      timeout: 20000
    });

    const uploadData: UploadTokenResponse = data.data;
    const filename = `${Date.now()}_${file.name}`;
    const key = `${uploadData.dir}${filename}`;

    const formData = new FormData();
    formData.append('key', key);
    formData.append('policy', uploadData.policy);
    formData.append('OSSAccessKeyId', uploadData.accessKeyId);
    formData.append('signature', uploadData.signature);
    formData.append('success_action_status', '200');
    formData.append('file', file);

    await axios.post(uploadData.host, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return `${uploadData.host}/${key}`;
  }
}
