import React, { useState } from 'react';
import { Card, CardContent, CardHeader, TextField, Button } from '@mui/material';
import axios from '../../../utils/axiosConfig';
import { useMutation } from 'react-query';

const CreateOptionGroup = () => {
  const [optionGroup, setOptionGroup] = useState('');
  const [options, setOptions] = useState(Array(12).fill(''));

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const createOptionGroupMutation = useMutation(
    async () => {
      const { data: newOptionGroup } = await axios.post('/api/options/groups', { name: optionGroup }, { withCredentials: true });
      const newOptions = options.filter(option => option);
      const promises = newOptions.map(option => axios.post('/api/options', { name: option, option_group_id: newOptionGroup.id }, { withCredentials: true }));
      await Promise.all(promises);
    },
    {
      onSuccess: () => {
        setOptionGroup('');
        setOptions(Array(12).fill(''));
        alert('Option group and options created successfully!');
      },
      onError: (error) => {
        alert('There was an error creating the option group and options:\n\n' + error.message);
      },
    }
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    createOptionGroupMutation.mutate();
  };

  return (
    <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
      <CardHeader title="Option Group and Options" sx={{ pb: 0 }} />
      <CardContent>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Option Group"
            value={optionGroup}
            onChange={(e) => setOptionGroup(e.target.value)}
            sx={{ mb: 2 }}
          />
          {options.map((option, index) => (
            <TextField
              fullWidth
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              sx={{
                mb: 2,
                display: index > 0 && !options[index - 1] ? 'none' : 'block',
              }}
            />
          ))}
          <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={createOptionGroupMutation.isLoading}>
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateOptionGroup;