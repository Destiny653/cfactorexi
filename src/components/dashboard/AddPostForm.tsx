import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { PostFormData } from '../../types/dashboardTypes';

interface AddPostFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: PostFormData) => Promise<void>;
}

const AddPostForm: React.FC<AddPostFormProps> = ({ open, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<PostFormData>({
        title: '',
        body: '',
        tags: [],
        published: true
    });
    const [tagInput, setTagInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create New Post</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Post Title
                            </label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                                Content
                            </label>
                            <textarea
                                name="body"
                                id="body"
                                rows={6}
                                required
                                value={formData.body}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border border-input shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2"
                            />
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                                Tags
                            </label>
                            <div className="mt-1 flex gap-2">
                                <Input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                                    className="flex-1"
                                    placeholder="Add tag and press Enter"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddTag}
                                >
                                    Add
                                </Button>
                            </div>
                            {formData.tags.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {formData.tags.map(tag => (
                                        <Badge key={tag} className="flex items-center">
                                            {tag}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 text-gray-400 hover:text-gray-600"
                                            >
                                                &times;
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="published"
                                name="published"
                                checked={formData.published}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    published: e.target.checked
                                }))}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                                Publish immediately
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Create Post
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPostForm;