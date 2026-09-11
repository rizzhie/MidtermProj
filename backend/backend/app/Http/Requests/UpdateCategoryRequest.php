<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $category = $this->route('category');

        return [
            'key' => [
                'sometimes', 'required', 'string', 'max:255', 'alpha_dash',
                Rule::unique('categories', 'key')->ignore($category),
            ],
            'label' => ['sometimes', 'required', 'string', 'max:255'],
        ];
    }
}
