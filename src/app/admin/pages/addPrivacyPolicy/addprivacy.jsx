'use client';
import React , { useRef } from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

// Dynamically import JoditEditor for SSR compatibility
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: true });

const PrivacyPolicyPage = () => {
    const editorRef = useRef(null);
    const [formData, setFormData] = useState({
        Title: '',
        description: '',
        Text: '',
    });
    const [privacyPolicy, setPrivacyPolicy] = useState(null);
    const [editorContent, setEditorContent] = useState(''); // Track content separately for JoditEditor
    const [isEditorReady, setIsEditorReady] = useState(false);

    // Load JoditEditor once the component is mounted and data is fetched
    useEffect(() => {
        async function fetchPrivacyPolicy() {
            try {
                const response = await axios.get('/api/privacypolicy');
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const existingPolicy = response.data[0];
                    setPrivacyPolicy(existingPolicy);
                    setFormData({
                        Title: existingPolicy.Title || '',
                        description: existingPolicy.description || '',
                        Text: existingPolicy.Text || '',
                    });
                    setEditorContent(existingPolicy.Text || ''); // Set initial content for JoditEditor
                }
            } catch (error) {
                console.error('Error fetching privacy policy:', error);
            } finally {
                setIsEditorReady(true); // Editor is ready to load
            }
        }
        fetchPrivacyPolicy();
    }, []);

    // Synchronize formData.Text and editorContent if formData.Text changes
    // useEffect(() => {
    //     if (formData.Text) {
    //         setEditorContent(formData.Text);
    //     }
    // }, [formData.Text]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleTextChange = (content) => {
        setFormData({ ...formData, Text: content });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (privacyPolicy && privacyPolicy.id) {
                // Update existing privacy policy
                await axios.put(`/api/privacypolicy/${privacyPolicy.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // Create new privacy policy
                const response = await axios.post('/api/privacypolicy', formData, {
                    headers: { 'Content-Type': 'application/json' },
                });
                setPrivacyPolicy(response.data);
            }
            alert('Privacy policy saved successfully!');
        } catch (error) {
            console.error('Error saving privacy policy:', error);
            alert('Failed to save privacy policy.');
        }
    };
    useEffect(() => {
        if (editorRef.current && isEditorReady) {
          editorRef.current.value = editorContent;  // Directly set the editor's content
        }
      }, [editorContent, isEditorReady]);
      

    return (
        <div className="p-6 max-w-full mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Privacy Policy</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-600 font-medium">Title:</label>
                    <input
                        type="text"
                        name="Title"
                        value={formData.Title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-600 font-medium">Text:</label>
                    {isEditorReady && (
                      <JoditEditor
                      ref={editorRef}
                      value={editorContent}
                      onChange={handleTextChange}
                      config={{
                        readonly: false,
                        placeholder: 'Start writing your privacy policy...',
                      }}
                    />
                    
                    )}

                </div>
                <button type="submit" className="w-full mt-4 p-3 bg-gray-700 text-white font-semibold rounded hover:bg-gray-800 transition">
                    {privacyPolicy ? 'Update Privacy Policy' : 'Save Privacy Policy'}
                </button>
            </form>
        </div>
    );
};

export default PrivacyPolicyPage;
