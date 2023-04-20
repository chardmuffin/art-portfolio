import { useState } from 'react';
import { Card, CardContent, CardHeader, TextField } from '@mui/material';

const CreateOptions = () => {
  const [optionGroup, setOptionGroup] = useState('');
  const [options, setOptions] = useState(['']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOptionField = () => {
    if (options.length < 3) {
      setOptions([...options, '']);
    }
  };

  return (
    <Card sx={{ boxShadow: 8, borderRadius: '4px', mt: 2 }}>
      <CardHeader title="Option Group and Options" sx={{ pb: 0 }} />
      <CardContent>
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
            sx={{ mb: 2 }}
            hidden={index > 0 && !options[index - 1]}
          />
        ))}
        {options.length < 3 && options[options.length - 1] && (
          <TextField fullWidth label={`Option ${options.length + 1}`} sx={{ mb: 2 }} onClick={addOptionField} />
        )}
      </CardContent>
    </Card>
  );
};

export default CreateOptions;