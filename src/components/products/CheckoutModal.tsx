'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export interface UserData {
  name: string;
  cpf: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
  agreeShipping: boolean;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserData) => void;
}

interface CepData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function CheckoutModal({ isOpen, onClose, onSubmit }: CheckoutModalProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [complement, setComplement] = useState('');
  const [agreeShipping, setAgreeShipping] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [errors, setErrors] = useState({ 
    name: false, 
    cpf: false, 
    phone: false, 
    cep: false, 
    street: false, 
    number: false, 
    neighborhood: false, 
    city: false, 
    state: false,
    agreeShipping: false
  });

  const validateAndSubmit = () => {
    const newErrors = {
      name: name.trim().split(' ').length < 2,
      cpf: !/^\d{11}$/.test(cpf.replace(/\D/g, '')),
      phone: !/^\d{10,11}$/.test(phone.replace(/\D/g, '')),
      cep: !/^\d{8}$/.test(cep.replace(/\D/g, '')),
      street: street.trim().length < 3,
      number: number.trim().length === 0,
      neighborhood: neighborhood.trim().length < 3,
      city: city.trim().length < 3,
      state: state.trim().length !== 2,
      agreeShipping: !agreeShipping,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) {
      return;
    }

    onSubmit({ 
      name, 
      cpf, 
      phone, 
      cep, 
      street, 
      number, 
      neighborhood, 
      city, 
      state, 
      complement,
      agreeShipping
    });
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };
  
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 10) {
      return digits
        .slice(0, 10)
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return digits
      .slice(0, 11)
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const formatCep = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const fetchCep = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data: CepData = await response.json();
      
      if (!data.erro) {
        setStreet(data.logradouro);
        setNeighborhood(data.bairro);
        setCity(data.localidade);
        setState(data.uf);
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCepChange = (value: string) => {
    const formattedCep = formatCep(value);
    setCep(formattedCep);
    
    if (formattedCep.replace(/\D/g, '').length === 8) {
      fetchCep(formattedCep);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quase lá!</DialogTitle>
          <DialogDescription>
            Precisamos de algumas informações para concluir seu pedido.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700">Dados Pessoais</h3>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-xs text-red-600">Por favor, insira seu nome completo.</p>}
            </div>
            <div className="space-y-2">
               <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
              <Input 
                id="cpf" 
                value={cpf} 
                onChange={(e) => setCpf(formatCpf(e.target.value))} 
                className={errors.cpf ? 'border-red-500' : ''}
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="text-xs text-red-600">CPF inválido. Insira 11 dígitos.</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Telefone / WhatsApp</label>
              <Input 
                id="phone" 
                value={phone} 
                onChange={(e) => setPhone(formatPhone(e.target.value))} 
                className={errors.phone ? 'border-red-500' : ''}
                placeholder="(00) 00000-0000"
              />
               {errors.phone && <p className="text-xs text-red-600">Telefone inválido. Insira DDD + número.</p>}
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700">Endereço de Entrega</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label htmlFor="cep" className="text-sm font-medium">CEP</label>
                <Input 
                  id="cep" 
                  value={cep} 
                  onChange={(e) => handleCepChange(e.target.value)} 
                  className={errors.cep ? 'border-red-500' : ''}
                  placeholder="00000-000"
                  disabled={loadingCep}
                />
                {loadingCep && <p className="text-xs text-blue-600">Buscando endereço...</p>}
                {errors.cep && <p className="text-xs text-red-600">CEP inválido.</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="number" className="text-sm font-medium">Número</label>
                <Input 
                  id="number" 
                  value={number} 
                  onChange={(e) => setNumber(e.target.value)} 
                  className={errors.number ? 'border-red-500' : ''}
                  placeholder="123"
                />
                {errors.number && <p className="text-xs text-red-600">Número é obrigatório.</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="street" className="text-sm font-medium">Rua</label>
              <Input 
                id="street" 
                value={street} 
                onChange={(e) => setStreet(e.target.value)} 
                className={errors.street ? 'border-red-500' : ''}
                placeholder="Rua das Flores"
              />
              {errors.street && <p className="text-xs text-red-600">Rua é obrigatória.</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="neighborhood" className="text-sm font-medium">Bairro</label>
              <Input 
                id="neighborhood" 
                value={neighborhood} 
                onChange={(e) => setNeighborhood(e.target.value)} 
                className={errors.neighborhood ? 'border-red-500' : ''}
                placeholder="Centro"
              />
              {errors.neighborhood && <p className="text-xs text-red-600">Bairro é obrigatório.</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">Cidade</label>
                <Input 
                  id="city" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className={errors.city ? 'border-red-500' : ''}
                  placeholder="São Paulo"
                />
                {errors.city && <p className="text-xs text-red-600">Cidade é obrigatória.</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">Estado</label>
                <Input 
                  id="state" 
                  value={state} 
                  onChange={(e) => setState(e.target.value.toUpperCase())} 
                  className={errors.state ? 'border-red-500' : ''}
                  placeholder="SP"
                  maxLength={2}
                />
                {errors.state && <p className="text-xs text-red-600">Estado é obrigatório.</p>}
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="complement" className="text-sm font-medium">Complemento (opcional)</label>
              <Input 
                id="complement" 
                value={complement} 
                onChange={(e) => setComplement(e.target.value)} 
                placeholder="Apartamento, bloco, etc."
              />
            </div>
          </div>

          {/* Termos de Envio */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-gray-700">Método de Envio</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-medium">🚚</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Transportadora Flex</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    Entrega em até 5 dias úteis para todo o Brasil. 
                    Rastreamento disponível via código de rastreio.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agreeShipping"
                  checked={agreeShipping}
                  onCheckedChange={(checked) => setAgreeShipping(checked as boolean)}
                  className={errors.agreeShipping ? 'border-red-500' : ''}
                />
                <label htmlFor="agreeShipping" className="text-sm text-gray-700 leading-relaxed">
                  Concordo com o método de envio pela <strong>Transportadora Flex</strong> e 
                  aceito receber meu pedido no endereço informado acima.
                </label>
              </div>
              {errors.agreeShipping && (
                <p className="text-xs text-red-600">
                  É necessário concordar com o método de envio para continuar.
                </p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={validateAndSubmit} className="w-full bg-green-500 hover:bg-green-600">
            Enviar Pedido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 