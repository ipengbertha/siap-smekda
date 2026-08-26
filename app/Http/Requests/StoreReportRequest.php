<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // izin sudah dicek lewat middleware auth di route
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:aduan,aspirasi'],
            'category_id' => ['required', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'is_anonymous' => ['boolean'],
            'attachments' => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'mimes:jpg,jpeg,png,mp4,mov', 'max:10240'], // max 10MB per file
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak valid.',
            'title.required' => 'Judul aduan wajib diisi.',
            'description.required' => 'Isi aduan wajib diisi.',
            'description.min' => 'Isi aduan minimal 10 karakter.',
            'attachments.*.mimes' => 'Lampiran harus berupa gambar (jpg, png) atau video (mp4, mov).',
            'attachments.*.max' => 'Ukuran lampiran maksimal 10MB.',
        ];
    }
}